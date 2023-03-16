import { CSSProperties, ReactNode } from 'react';
import './emptyState.scss';
interface GenericEmptyStateType {
    title: ReactNode;
    image?: any;
    classname?: string;
    subTitle?: ReactNode;
    isButtonAvailable?: boolean;
    styles?: CSSProperties;
    heightToDeduct?: number;
    imageType?: string;
    renderButton?: () => JSX.Element;
    imageClassName?: string;
    children?: ReactNode;
    noImage?: boolean;
}
declare function GenericEmptyState({ title, image, subTitle, isButtonAvailable, classname, styles, heightToDeduct, imageType, renderButton, imageClassName, children, noImage }: GenericEmptyStateType): JSX.Element;
export default GenericEmptyState;
