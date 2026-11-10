import React, { useState, useRef, useEffect, useCallback } from 'react';
import './swipe-slider.scss';
import { HiChevronDoubleRight } from 'react-icons/hi2';
import { TbLoader } from 'react-icons/tb';

const SwipeSlider = ({
    onSwipe,
    text = 'Slide to confirm',
    variant = 'in', // 'in' | 'out' | 'scanner'
    isLoading = false,
    icon = null,
    disabled = false
}) => {
    const [slidePosition, setSlidePosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef(null);
    const thumbRef = useRef(null);
    const startXRef = useRef(0);
    const isDraggingRef = useRef(false);
    const slidePositionRef = useRef(0);

    // Keep refs in sync
    isDraggingRef.current = isDragging;
    slidePositionRef.current = slidePosition;

    // Reset slider when loading completes or if disabled
    useEffect(() => {
        if (!isLoading) {
            setSlidePosition(0);
            slidePositionRef.current = 0;
            setIsDragging(false);
            isDraggingRef.current = false;
        }
    }, [isLoading, disabled]);

    const getMaxSlide = useCallback(() => {
        if (!trackRef.current || !thumbRef.current) return 200;
        const trackWidth = trackRef.current.clientWidth;
        const thumbWidth = thumbRef.current.clientWidth;
        return Math.max(0, trackWidth - thumbWidth - 8); // 4px padding on each side
    }, []);

    const handleStart = (clientX) => {
        if (isLoading || disabled) return;
        setIsDragging(true);
        isDraggingRef.current = true;
        startXRef.current = clientX - slidePositionRef.current;
    };

    const handleMove = useCallback((clientX) => {
        if (!isDraggingRef.current || isLoading || disabled) return;
        const maxSlide = getMaxSlide();
        const currentDelta = clientX - startXRef.current;
        const clampedDelta = Math.max(0, Math.min(currentDelta, maxSlide));
        setSlidePosition(clampedDelta);
        slidePositionRef.current = clampedDelta;
    }, [getMaxSlide, isLoading, disabled]);

    const handleEnd = useCallback(() => {
        if (!isDraggingRef.current) return;
        setIsDragging(false);
        isDraggingRef.current = false;

        const maxSlide = getMaxSlide();
        const threshold = maxSlide * 0.70;

        if (slidePositionRef.current >= threshold && !isLoading && !disabled) {
            // Success snap
            setSlidePosition(maxSlide);
            slidePositionRef.current = maxSlide;

            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                try {
                    navigator.vibrate([30, 40, 30]);
                } catch (e) {
                    // ignore
                }
            }

            if (onSwipe) {
                onSwipe();
            }
        } else {
            // Elastic snap-back
            setSlidePosition(0);
            slidePositionRef.current = 0;
        }
    }, [getMaxSlide, isLoading, disabled, onSwipe]);

    // Touch event handlers
    const onTouchStart = (e) => {
        handleStart(e.touches[0].clientX);
    };

    const onTouchMove = (e) => {
        handleMove(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
        handleEnd();
    };

    // Mouse event handlers (for desktop testing / emulation)
    const onMouseDown = (e) => {
        e.preventDefault();
        handleStart(e.clientX);
    };

    useEffect(() => {
        const onMouseMove = (e) => {
            if (isDraggingRef.current) {
                handleMove(e.clientX);
            }
        };

        const onMouseUp = () => {
            if (isDraggingRef.current) {
                handleEnd();
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [handleMove, handleEnd]);

    const maxSlide = getMaxSlide();
    const progress = maxSlide > 0 ? slidePosition / maxSlide : 0;
    const textOpacity = Math.max(0, 1 - progress * 1.6);

    return (
        <div
            className={`swipe-slider-component ${variant} ${isDragging ? 'is-dragging' : ''} ${isLoading ? 'is-loading' : ''} ${disabled ? 'is-disabled' : ''}`}
            ref={trackRef}
        >
            {/* Background dynamic fill */}
            <div
                className="swipe-track-fill"
                style={{
                    width: `calc(${slidePosition}px + 48px)`,
                    transition: isDragging ? 'none' : 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
            />

            {/* Track Center Label */}
            <div
                className="swipe-track-text"
                style={{
                    opacity: textOpacity,
                    transition: isDragging ? 'none' : 'opacity 0.2s ease'
                }}
            >
                <span>{text}</span>
                <span className="shimmer-arrows">
                    <HiChevronDoubleRight />
                </span>
            </div>

            {/* Draggable Thumb */}
            <div
                className="swipe-thumb"
                ref={thumbRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchEnd}
                onMouseDown={onMouseDown}
                style={{
                    transform: `translateX(${slidePosition}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
            >
                {isLoading ? (
                    <TbLoader className="thumb-spinner" />
                ) : (
                    icon || <HiChevronDoubleRight />
                )}
            </div>
        </div>
    );
};

export default SwipeSlider;
