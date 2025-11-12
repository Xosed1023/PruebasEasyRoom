export interface Option {
    label: string;
    value: string;
  }
  
export interface OptionSelectorProps {
    options: Option[];
    selectedOption: string;
    onOptionChange: (value: string) => void;
  }
  