import { ComponentRegistry } from "@json-render/react";

// components/registry.tsx
export const registry: ComponentRegistry = {
  Card: ({ element, children }) => (
    <div className="rounded-lg border p-4">
      <h2 className="font-bold">{element.props.title}</h2>
      {element.props.description && (
        <p className="text-gray-600">{element.props.description}</p>
      )}
      {children}
    </div>
  ),
  Button: ({ element, onAction }) => (
    <button
      className="rounded bg-blue-500 px-4 py-2 text-white"
      onClick={() => onAction?.(element.props.action)}
    >
      {element.props.label}
    </button>
  ),
  Text: ({ element }) => <p>{element.props.content}</p>,
};
