'use client'

import type { ReactNode } from 'react'
import {
    DefaultEditor as Editor,
    Toolbar,
    BtnBold,
    BtnItalic,
    BtnUnderline,
    BtnBulletList,
    BtnNumberedList,
    BtnLink,
    Separator,
} from 'react-simple-wysiwyg'
import type { ContentEditableEvent } from 'react-simple-wysiwyg'

interface Props {
    value: string
    onChange: (value: string) => void
    style?: React.CSSProperties
    imageButton: ReactNode
}

export default function SpotGuideEditorInner({ value, onChange, style, imageButton }: Props) {
    return (
        <Editor
            value={value}
            onChange={(e: ContentEditableEvent) => onChange(e.target.value)}
            style={{ minHeight: '150px', ...style }}
        >
            <Toolbar>
                <BtnBold />
                <BtnItalic />
                <BtnUnderline />
                <Separator />
                <BtnBulletList />
                <BtnNumberedList />
                <Separator />
                <BtnLink />
                <Separator />
                {imageButton}
            </Toolbar>
        </Editor>
    )
}
