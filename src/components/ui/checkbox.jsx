// src/components/ui/checkbox.jsx
import * as React from "react";

const Checkbox = React.forwardRef(({ className = "", ...props }, ref) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      ref={ref}
      className={`h-4 w-4 rounded border border-primary text-primary focus:ring-primary ${className}`}
      {...props}
    />
    {props.label && (
      <label 
        htmlFor={props.id} 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {props.label}
      </label>
    )}
  </div>
));

Checkbox.displayName = "Checkbox";

export { Checkbox };