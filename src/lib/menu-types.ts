export type Choice = {
  name: string;
  /** Added once per tray when this choice is picked (e.g. smoked salmon +45). */
  extra?: number;
};

export type OptionGroup = {
  id: string;
  legend: string;
  /** Short label for the card button, e.g. "בחירת מילויים". */
  cta: string;
  min: number;
  max: number;
  choices: Choice[];
};

export type Category = {
  id: string;
  name: string;
  note: string;
  image: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  image: string;
  unit?: string;
  description?: string;
  optionGroupId?: string;
  badge?: string;
  featured?: boolean;
};

export type Menu = {
  categories: Category[];
  items: MenuItem[];
  optionGroups: OptionGroup[];
};
