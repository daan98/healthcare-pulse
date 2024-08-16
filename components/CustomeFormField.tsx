"use client"

import {  FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from './ui/checkbox';
import { Control } from 'react-hook-form';
import { es } from "date-fns/locale/es";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import DatePicker, { registerLocale } from "react-datepicker";
import Image from 'next/image';
import PhoneInput from 'react-phone-number-input';
import React from 'react';

import { FormFieldTypeEnum } from './forms/PatientForm';

import 'react-phone-number-input/style.css';
import "react-datepicker/dist/react-datepicker.css";

registerLocale("es", es);

export interface FormFieldInterface {
  children         ?: React.ReactNode;
  control           : Control<any>;
  dateFormart      ?: string;
  disabled         ?: boolean;
  fieldDescription ?: string;
  fieldType         : FormFieldTypeEnum;
  iconAlt          ?: string;
  iconSrc          ?: string;
  label            ?: string;
  name              : string;
  placeholder      ?: string;
  renderSkeleton   ?: (field : any) => React.ReactNode;
  showTimeSelect   ?: boolean;
  multiField       ?: boolean;
}

const RenderField = ({field, props} : {field : any; props : FormFieldInterface}) => {
  const { children, dateFormart, disabled, fieldType, iconAlt, iconSrc, placeholder, renderSkeleton, showTimeSelect, name, label } = props;

  switch (fieldType) {
    case FormFieldTypeEnum.INPUT:
      return (
        <div
          className="flex rounded-md border border-dark-500 bg-dark-400"
        >
          {iconSrc && (
            <Image
              src={iconSrc}
              height={24}
              width={24}
              alt={iconAlt || "icon"}
              className='ml-2'
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className='shad-input border-0'
            />
          </FormControl>
        </div>
      );

    case FormFieldTypeEnum.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry='MX'
            placeholder={placeholder}
            international
            withCountrCallingCode
            value={field.value}
            onChange={field.onChange}
            className='input-phone'
          />
        </FormControl>
      )
    
    case FormFieldTypeEnum.DATE_PICKER:
      return (
        <div className='flex rounded-md border border-dark-500 bg-dark-400'>
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt='calendar'
            className='mx-2'
          />
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              locale="es"
              dateFormat="P"
              dateFormatCalendar={dateFormart ?? "MM/dd/yyyy"}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel='Fecha: '
              wrapperClassName='date-picker'
            />
          </FormControl>
        </div>
      )

    case FormFieldTypeEnum.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;
    
    case FormFieldTypeEnum.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className='shad-select-trigger'>
                <SelectValue
                  placeholder={placeholder}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent className='shad-select-content'>
              { children }
            </SelectContent>
          </Select>
        </FormControl>
      )

    case FormFieldTypeEnum.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className='shad-textArea'
            disabled={disabled}
          />
        </FormControl>
      )

    case FormFieldTypeEnum.CHECKBOX:
      return (
        <FormControl>
          <div className='flex items-center gap-4'>
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />

            <label
              htmlFor={name}
              className='checkbox-label'
            >
              { label }
            </label>
          </div>
        </FormControl>
      )
    default:
      break;
  }
};

const CustomeFormField = (props : FormFieldInterface) => {
  const { control, fieldDescription, fieldType, label, name, multiField } = props;

  return (
    <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className={multiField ? "flex-1 min-w-[calc(50%_-_24px)] xs:min-w-full" : "flex-1"}>
              { fieldType !== FormFieldTypeEnum.CHECKBOX && label && (
                <FormLabel>{ label }</FormLabel>
              )}

              <RenderField
                field={field}
                props={props}
              />

              <FormMessage className="">{ fieldDescription }</FormMessage>

            </FormItem>
          )}
        />
  )
}

export default CustomeFormField