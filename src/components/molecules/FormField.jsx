import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  error, 
  required, 
  options, 
  className,
  inputClassName,
  children,
  ...props 
}) => {
  const InputComponent = type === "select" ? Select : Input;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
      )}
      {type === "select" ? (
        <Select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          error={error}
          className={inputClassName}
          {...props}
        >
          {children || (
            <>
              <option value="">Select {label?.toLowerCase() || "option"}</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </>
          )}
        </Select>
      ) : (
        <InputComponent
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          error={error}
          className={inputClassName}
          {...props}
        />
      )}
      {error && (
        <p className="text-sm text-error-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;