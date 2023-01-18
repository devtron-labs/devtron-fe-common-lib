/// <reference types="react" />
import { TagType } from '../Types';
export default function TagDetails({ index, tagData, setTagData, removeTag, }: {
    index: number;
    tagData: TagType;
    setTagData: (index: number, tagData: TagType) => void;
    removeTag: (index: number) => void;
}): JSX.Element;
