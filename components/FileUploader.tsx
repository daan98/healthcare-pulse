"use client"

import {useDropzone} from 'react-dropzone'
import Image from 'next/image';
import React, {useCallback} from 'react'

import { convertFileToUrl } from '@/lib/utils';

type FileUploaderProps = {
  files    : File[] | undefined;
  onChange : (files : File[]) => void;
};

function FileUploader({files, onChange} : FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles : File[]) => {
    onChange(acceptedFiles);
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} className='file-upload'>
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt='documento descargado'
          className='max-h-[400px] overflow-hidden object-cover'
        />
      ) : (
      <>
        <Image
          src="/assets/icons/upload.svg"
          width={40}
          height={40}
          alt='icono de carga'
        />

        <div className='file-upload_label'>
          <p className='text-14-regular'>
            <span className='text-green-500'>
              Da clic para cargar archivo
            </span> o arrastra y sueltalo
          </p>
          <p>SVG, PNG, JPG o Gif (máximo 800x400)</p>
        </div>
      </>
      )}
    </div>
  )
};

export default FileUploader;