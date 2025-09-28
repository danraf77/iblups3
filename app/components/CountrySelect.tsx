'use client';

import { useState } from 'react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';

interface Country {
  id: number;
  name: string;
}

interface CountrySelectProps {
  countries: Country[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function CountrySelect({ 
  countries, 
  value, 
  onChange, 
  label = "País",
  placeholder = "Seleccionar país"
}: CountrySelectProps) {
  const [selected, setSelected] = useState<Country | undefined>(
    countries.find(country => country.name === value) || undefined
  );

  const handleChange = (country: Country) => {
    setSelected(country);
    onChange(country.name);
  };

  return (
    <Listbox value={selected} onChange={handleChange}>
      <Label className="block text-sm font-medium text-primary mb-1">
        {label}
      </Label>
      <div className="relative mt-2">
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-lg bg-input py-2 pr-2 pl-3 text-left text-primary outline-1 -outline-offset-1 outline-border-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2c73ff] sm:text-sm border border-border-primary">
          <span className="col-start-1 row-start-1 truncate pr-6">
            {selected ? selected.name : placeholder}
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-muted sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-card py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm border border-border-primary"
        >
          {countries.map((country) => (
            <ListboxOption
              key={country.id}
              value={country}
              className="group relative cursor-default py-2 pr-9 pl-3 text-primary select-none data-focus:bg-[#2c73ff] data-focus:text-white data-focus:outline-hidden hover:bg-button-active"
            >
              <span className="block truncate font-normal group-data-selected:font-semibold">
                {country.name}
              </span>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#2c73ff] group-not-data-selected:hidden group-data-focus:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
