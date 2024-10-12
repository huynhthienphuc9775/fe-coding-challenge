## Getting Started

First, install:
```bash
npm install
```

Second, run the development server:
```bash
npm run dev
```

Project Setup
Framework & Libraries & Estimation:

Use Next.js (App Router).
@dnd-kit for drag and drop functionality.
Recoil for state management.
Tailwind CSS for responsive design.

Folder Structure:
├── components/
│   ├── Button/   (Admin specific components)
│   ├── View/ (Admin and Consumer specific components)
├── app/
│   ├── admin/ (Admin view)
│   ├── consumer/ (Consumer view)
├── atoms/ (state management for Recoil)
├── utils/ (helper functions like `isItem` and type like `Item`)

Key Features & Implementation
1. Admin Page - Drag and Drop Builder
Components: Build two base components: ElementButton, ElementParagraph.
Drag and Drop: Use @dnd-kit for the drag and drop functionality.

Editing Components:
Use controlled inputs to change the text for ElementParagraph.
For ElementButton, provide inputs to modify both the button's label and the alert message.
State Management: Store the configuration of the page (components, their props) in Recoil.

2. Consumer Page - View-Only Mode
This page will display the components that the Admin has built.
Button Click: When a user clicks a button, show an alert message with the message defined by the Admin.
Local Storage: Retrieve the state from Admin.


Optional Features
1. Text Editing Inline
Apply my logic to directly alter text within the components.

2. Undo/Redo
Implement a state history mechanism using an array of items (current state), pastItems (past state), and futureItems (future state) for the state manager.

3. Export/Import
Serialize the component tree (using JSON) to enable exporting and importing built pages.

Estimation
1. Basic Features (Admin/Consumer pages, Drag and Drop, saving data): 2 hours
2. Text edit inline, additional components: 2 hours
3. Undo/Redo, Import/Export: 3 hours