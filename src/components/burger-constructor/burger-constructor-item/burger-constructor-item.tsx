import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Ingredient } from '../../../utils/types';
import styles from './burger-constructor-item.module.css';

interface BurgerConstructorItemProps {
    item: Ingredient;
    index?: number; 
    moveIngredient?: (dragIndex: number, hoverIndex: number) => void; 
    isLocked?: boolean;
    type?: 'top' | 'bottom'; 
    className?: string;
    handleRemove?: (id: string) => void;
}

const BurgerConstructorItem: React.FC<BurgerConstructorItemProps> = ({ item, index, moveIngredient, isLocked, type, className, handleRemove }) => {
    const ref = useRef<HTMLDivElement>(null);

   
    const [{ isDragging }, dragRef] = useDrag({
        type: 'ingredient',
        item: { index, uniqueId: item.uniqueId }, 
        canDrag: !isLocked && index !== undefined, 
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

   
    const [, dropRef] = useDrop({
        accept: 'ingredient',
        hover: (draggedItem: { index: number; uniqueId: string }) => {
            
            if (draggedItem.index !== index && index !== undefined && moveIngredient && !isLocked) {
                moveIngredient(draggedItem.index, index); 
                draggedItem.index = index;
            }
        },
    });


    dragRef(dropRef(ref));

    const icon = type === 'top' || type === 'bottom' ? null : <DragIcon type="primary" />;
    const comment = type === 'top' ? '(верх)' : type === 'bottom' ? '(низ)' : '';

    const handleRemoveClick = () => {
        if (item.uniqueId) {
            handleRemove?.(item.uniqueId); 
        }
    };

    return (
        <div
            ref={ref}
            className={`${className} ${styles.constructorElement} ${isDragging ? styles.dragging : ''}`}
        >
            {icon}
            <ConstructorElement
                type={type}
                text={`${item.name} ${comment}`}
                price={item.price}
                thumbnail={item.image}
                isLocked={isLocked}
                handleClose={handleRemoveClick}
            />
        </div>
    );
};

export default BurgerConstructorItem;
