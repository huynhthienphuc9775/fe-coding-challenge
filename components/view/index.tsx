import { Item } from "@/utils/itemUtils";
import React, { useState } from "react";
import { usePathname } from 'next/navigation';

type ViewProps = {
    items: Array<Item>;
    onClick?: (item: Item) => void;
    hovered?: (hovered: boolean) => void;
};

const View: React.FC<ViewProps> = ({ items, onClick, hovered }) => {
    const pathname = usePathname();

    const handleClick = (item: Item) => {
        if (onClick){
            onClick(item);
        }
    };
    const onShowAlert = (item: Item) => {
        if (pathname === '/consumer'){
            alert(item.props.message)
        }
    }

    const onHovered = (isHovered: boolean) => {
        if (hovered){
            hovered(isHovered)
        }
    }

    return (
        <>
            {items.map((item: Item, index: number) => {
                return (
                    <div onMouseEnter={() => onHovered(true)} onMouseLeave={() => onHovered(false)}  onClick={() => handleClick(item)} key={index}>
                        {item.component === "ElementButton" ? (
                            <button
                                onClick={() => onShowAlert(item)}
                                type="button"
                                className={`${item.props.text === ""
                                        ? "border-4 border-red-500 hover:border-red-700 transition-colors duration-500"
                                        : ""
                                    }
                         text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                            >
                                <p>{item.props.text}</p>
                            </button>
                        ) : (
                            <div
                                className={`${item.props.text === ""
                                        ? "border-4 border-red-500 hover:border-red-700 transition-colors duration-500 w-40 h-10"
                                        : ""
                                    } text-xl`}
                            >
                                <p>{item.props.text}</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default View;
