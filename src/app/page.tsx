"use client";

import { Box, TextField,Button, Typography } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import { useForm,SubmitHandler } from "react-hook-form";
import { useLanguageContext } from "./context/LanguageContext";
import { useState } from "react";

type Inputs = {
  watermarkText: string
  files: File[],
}

export default function Home() {

  const [result,setResult] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors,isSubmitting },
  } = useForm<Inputs>()

  function download(){
    result.forEach((imageBase64, index) => {
      const link = document.createElement('a');
      link.href = imageBase64;
      link.download = `image${index + 1}.png`;
      document.body.appendChild(link); 
      link.click();
      document.body.removeChild(link);
    });
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setResult([])
    const formData = new FormData();
    formData.append("watermarkText", data.watermarkText);
    
    Array.from(data.files).forEach((file: File) => {
      formData.append("images", file);
    });
    try {
      const response = await fetch("/api/watermark", {
        method: "POST",
        body: formData,
      });
      const body = await response.json()
      const images = body?.watermarkedImages;
      if(images) {
        setResult(images)
        reset()
      }
    } catch (error) {
      console.log(error);
    }
    
  }

  const files = watch("files");
  const filesArray = Array.from(files || []);
  const {language} = useLanguageContext()

  return (
    <Box>
      <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
        <Box marginTop='64px' minWidth={{xs:'250px',sm:'400px'}} component='form' display='flex' flexDirection='column' gap='12px' alignItems='center' onSubmit={handleSubmit(onSubmit)}>
          <TextField 
            fullWidth 
            label={language==='en' ? 'Enter watermark text' : 'Введите текст водяного знака' }
            {...register('watermarkText',{required:language==='en' ? 'Watermark text is required' : 'Текст водяного знака обязателен'})} 
          />
          {errors.watermarkText && <Typography color='error' fontSize='10px'>{errors.watermarkText.message}</Typography>}
          <Button
            variant="outlined"
            component="label"
            fullWidth
          >
            {language==='en' ? 'Upload Files' : 'Загрузить файлы'}
            <input
              {...register('files',{required: language==='en' ? 'Upload at least one file' : 'Загрузите хоть один файл'})}
              multiple
              type="file"
              hidden
              accept="image/*"
            />
          </Button>
          {errors.files && <Typography color='error' fontSize='10px'>{errors.files.message}</Typography>}
          <Box display='flex' flexDirection='column' gap='8px'>
            {filesArray.map((file:File,index)=>(
              <Box key={index} display='flex' alignItems='center' gap='8px'>
                <ImageIcon /><Typography>{file.name}</Typography>
              </Box>)
            )}
          </Box>
          <Box display='flex' gap='8px' alignItems='center'>
            <Button size='small' onClick={()=>reset()} variant="contained" color="error">
              {language==='en' ? 'Clear form' : 'Очистить форму'}
            </Button>
            <Button size='small' disabled={isSubmitting} type="submit" variant="contained" color="success">
              {language==='en' ? 'Submit' : 'Отправить'}
            </Button>
          </Box>
          
        </Box>
        <Box display='flex' flexDirection='column' gap='12px' margin='12px 0' maxWidth={{xs:'300px',sm:'600px'}}>
          {isSubmitting && <Typography>{language==='en' ? 'Loading...' : 'Загрузка...'}</Typography>}
          {result?.length ? <>
          <Typography>{language==='en' ? 'Result' : 'Результат' }</Typography>
          <Box>
            <Button size='small' onClick={()=>setResult([])} variant="outlined" color="error">
                {language==='en' ? 'Clear' : 'Очистить'}
            </Button>
            <Button size='small' onClick={()=>download()} variant="outlined" color="success">
                {language==='en' ? 'Download all' : 'Скачать все изображения'}
            </Button>
            <Typography fontSize='11px'>{language==='en' ? 'Browser can ask permission to download multiple files*' : 'Браузеру может потребоваться разрешение для скачивания сразу нескольких файлов*' }</Typography>
          </Box>
          
          <Box display='flex' flexWrap='wrap'
            gap="8px" 
            sx={{ 
              maxWidth: '100%', 
              whiteSpace: 'nowrap', 
              overflowX:'auto',
              overflowY:'hidden',
              '::-webkit-scrollbar': { display: 'none' } 
            }}>
            {Array.isArray(result) && result?.map((image,index)=><Box key={index} width='300px'><img alt={`image${index}`} style={{maxWidth:'100%',height:'auto'}} key={index} src={image}/></Box>)}
          </Box>
          </> : null}
        </Box>
      </Box>
    </Box>
  );
}
