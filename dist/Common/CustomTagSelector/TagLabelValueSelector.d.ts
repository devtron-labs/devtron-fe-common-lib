/// <reference types="react" />
import { OptionType, TagType } from '../Types';
export default function TagLabelValueSelector({ selectedTagIndex, tagData, setTagData, tagOptions, isRequired, type, }: {
    selectedTagIndex: number;
    tagData: TagType;
    setTagData: (index: number, tagData: TagType) => void;
    tagOptions?: OptionType[];
    isRequired?: boolean;
    type?: string;
}): JSX.Element;
