import { OptionType, TagType } from '../Types';
export declare const TagLabelValueSelector: ({ selectedTagIndex, tagData, setTagData, tagOptions, isRequired, type, }: {
    selectedTagIndex: number;
    tagData: TagType;
    setTagData: (index: number, tagData: TagType) => void;
    tagOptions?: OptionType[];
    isRequired?: boolean;
    type?: string;
}) => JSX.Element;
