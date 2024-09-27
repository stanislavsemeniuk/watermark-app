'use client'

import { Box, Typography } from '@mui/material'
import React from 'react'
import { useLanguageContext } from '../context/LanguageContext'

export default function Header() {
    const {language,changeLanguage} = useLanguageContext()
  return (
    <Box display='flex' alignItems='center' justifyContent='space-between' padding='8px 16px' bgcolor={'#000'}>
        <Typography color='#fff'>{language==='en' ? 'Add watermark to your images' : 'Добавить водяной знак к своим изображениям'}</Typography>
        <Box display='flex' alignItems='center' gap='8px'>
            <Typography style={{cursor:'pointer'}} onClick={()=>changeLanguage('en')} fontSize='14px' color={language==='en' ? 'primary' : '#fff'}>EN</Typography>
            <Typography style={{cursor:'pointer'}} onClick={()=>changeLanguage('ru')} fontSize='14px' color={language==='ru' ? 'primary' : '#fff'}>RU</Typography>
        </Box>
    </Box>
  )
}