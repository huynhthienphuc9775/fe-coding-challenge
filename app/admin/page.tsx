"use client";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragStartEvent,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";
import { throttle } from "lodash";
import { isItem, Item } from "@/utils/itemUtils";
import { useRecoilState } from "recoil";
import { view_data } from "@/atoms/view";
import View from "@/components/view";
import Button from "@/components/button";

export default function Admin() {
    const [viewData, setViewData] = useRecoilState(view_data);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [draggingItem, setDraggingItem] = useState<string | null>(null);
    const [activeItem, setActiveItem] = useState<Item | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [pastItems, setPastItems] = useState<Item[][]>([]);
    const [futureItems, setFutureItems] = useState<Item[][]>([]);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    useEffect(() => {
        if (activeItem) {
            setItems((prevItems) =>
                prevItems.map((item) => (item.id === activeItem.id ? activeItem : item))
            );
        }
    }, [activeItem]);

    const onUndo = () => {
        const previous = pastItems[pastItems.length - 1];
        const newPast = pastItems.slice(0, pastItems.length - 1);
        setPastItems(newPast);
        setFutureItems([items, ...futureItems]);
        setItems(previous);
        setActiveItem(null);
    };

    const onRedo = () => {
        const next = futureItems[0];
        const newFuture = futureItems.slice(1);
        setFutureItems(newFuture);
        setPastItems([...pastItems, items]);
        setItems(next);
        setActiveItem(null);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setDraggingItem(event.active.id as string);
    };

    const handleDragMove = (event: DragMoveEvent) => { };
    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;

        if (!over) return;
        const value: Item =
            active.id === "Button"
                ? {
                    id: Math.random(),
                    component: "ElementButton",
                    props: { text: "Button", message: "" },
                }
                : {
                    id: Math.random(),
                    component: "ElementParagraph",
                    props: { text: "Paragraph" },
                };
        setPastItems((prevPast) => [...prevPast, items]);
        setItems((prevItems) => [...prevItems, value]);
        setFutureItems([]);
        setDraggingItem(null);
    };

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value, name } = event.target;
            if (activeItem) {
                const updatedItem = {
                    ...activeItem,
                    props: {
                        ...activeItem.props,
                        [name]: value,
                    },
                };

                setActiveItem(updatedItem);
            }
        },
        [activeItem]
    );

    const handleMouseMove = throttle(
        (event) => {
            if (isHovered) return;
            const x = event.nativeEvent.offsetX;
            const y = event.nativeEvent.offsetY;
            setMousePosition({ x, y });
        },
        200,
        { leading: false, trailing: true }
    );

    const onEditProps = (prop: Item) => {
        setActiveItem(prop);
    };

    const onSetHovered = (isHovered: boolean) => {
        setIsHovered(isHovered)
    }

    const Draggable = useMemo(
        () =>
            ({ id, label }: { id: string; label: string }) => {
                const { attributes, listeners, setNodeRef, transform } = useDraggable({
                    id,
                });
                const style = {
                    transform: transform
                        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                        : undefined,
                    cursor: "grab",
                };
                return (
                    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
                        <div className="text-center">
                            <div className="w-20 h-20 border-2"></div>
                            <p>{label}</p>
                        </div>
                    </div>
                );
            },
        []
    );

    const Droppable = useMemo(
        () => () => {
            const { isOver, setNodeRef } = useDroppable({
                id: "droppable",
            });
            const { x, y } = mousePosition;
            return (
                <div
                    
                    className="w-full h-3/5"
                    style={{ lineBreak: "anywhere" }}
                >
                    <div
                        className="w-full h-full"
                        ref={setNodeRef}
                    >
                        <div className="w-full h-full flex flex-col xl:flex-row">
                            <div className="xl:w-2/4 w-full h-full p-2 overflow-scroll border-b-2 xl:border-b-0 xl:border-r-2 ">
                                <div>
                                    <p>
                                        Mouse: ({x}, {y})
                                    </p>
                                    <p>
                                        Dragging: {draggingItem ? `Element${draggingItem}` : ""}{" "}
                                    </p>
                                    <p>Instances: {items.length}</p>
                                    <p>
                                        Config:{" "}
                                        {activeItem !== null ? JSON.stringify(activeItem) : null}
                                    </p>
                                </div>
                            </div>
                            <div className="xl:w-2/4 w-full h-full p-2 flex flex-col gap-3 items-center overflow-scroll">
                                <View items={items} onClick={onEditProps} hovered={onSetHovered} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
        [
            activeItem,
            items,
            mousePosition,
            draggingItem,
            handleInputChange,
            onEditProps,
        ]
    );

    const onExport = () => {
        const dataStr = JSON.stringify(items);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "formData.json";
        link.click();

        URL.revokeObjectURL(url);
    };

    const onImport = (event: any) => {
        const file = event.target.files[0];

        if (!file) return;

        if (file.type !== "application/json") {
            alert("Please upload a valid JSON file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
            const loadedData = JSON.parse(e.target.result);

            if (Array.isArray(loadedData) && loadedData.every(isItem)) {
                setPastItems((prevPast) => [...prevPast, items]);
                setItems(loadedData);
                setFutureItems([]);
            } else {
                alert("Invalid data structure. Expected an array of Items.");
            }
        };

        if (file) {
            reader.readAsText(file);
        }
    };

    const handleFileUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onSave = () => {
        setViewData(items);
    };

    const onView = () => {
        localStorage.setItem("view_data", JSON.stringify(items));
        window.open("/consumer", "_blank");
    };

    return (
        <div className="h-screen w-full">
            <div className="p-2 flex flex-wrap gap-4 justify-center">
                <Button label="Save" onClick={onSave} disabled={!items.length} />
                <Button label="Undo" onClick={onUndo} disabled={!pastItems.length} />
                <Button label="Redo" onClick={onRedo} disabled={!futureItems.length} />
                <Button label="Export" onClick={onExport} disabled={!items.length} />
                <Button label="Import" onClick={handleFileUploadClick} />
                <Button label="View" disabled={!viewData.length} onClick={onView} />
            </div>
            <div className="h-full w-full">
                <DndContext
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                >
                    <div className="border-y-2 flex flex-col xl:flex-row sm:items-center xl:items-start h-full">
                        <div className="w-full border-b-2 xl:border-b-0 xl:w-1/4 p-2 flex flex-row xl:flex-col gap-8 justify-center items-center">
                            <Draggable id="Paragraph" label="Paragraph" />
                            <Draggable id="Button" label="Button" />
                        </div>
                        <div onMouseMove={handleMouseMove} className="w-full h-full border-l-2">
                            <Droppable />
                            <div className="w-full border-t-2 p-2">
                                {activeItem && (
                                    <div className="w-full">
                                        <div className="mb-6 w-full">
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                <b>
                                                    {activeItem.component === "ElementButton"
                                                        ? "Button"
                                                        : "Paragraph"}{" "}
                                                    Text
                                                </b>
                                            </label>
                                            <input
                                                value={activeItem?.props?.text || ""}
                                                onChange={handleInputChange}
                                                type="text"
                                                id="text"
                                                name="text"
                                                className={`w-2/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5`}
                                                placeholder="Text"
                                                required
                                            />
                                            {activeItem?.props?.text === "" && (
                                                <p className="text-rose-600">
                                                    *If you do not enter text, we will remove this
                                                    component during viewing.
                                                </p>
                                            )}
                                        </div>
                                        {activeItem.component === "ElementButton" && (
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    <b>Alert Message</b>
                                                </label>
                                                <input
                                                    value={activeItem?.props?.message || ""}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    id="message"
                                                    name="message"
                                                    className={`w-2/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5`}
                                                    placeholder="Alert Message"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DndContext>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onImport}
            />
        </div>
    );
}
