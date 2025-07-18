import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './drop-down.scss'
import SingleButton from '../buttons/SingleButton';

const DropDown = ({ items = [], dropButton }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef();
  const menuRef = useRef();


  const calculatePosition = () => {
    const button = wrapperRef.current;
    const menu = menuRef.current;
    if (!button || !menu) return;

    const btnRect = button.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect(); // more accurate than offsetWidth
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    // 🔥 vertical fallback
    let top = btnRect.bottom;
    if (btnRect.bottom + menuRect.height > screenHeight) {
      if (btnRect.top - menuRect.height > 0) {
        top = btnRect.top - menuRect.height;
      } else {
        top = screenHeight - menuRect.height - 10; // fallback bottom space
      }
    }

    // 🔥 horizontal fallback
    let left = btnRect.left;
    if (btnRect.left + menuRect.width > screenWidth) {
      left = screenWidth - menuRect.width - 10;
    }
    if (left < 0) left = 10; // fallback left space

    setPosition({ x: left, y: top });
  };

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (open) {
      calculatePosition();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setOpen(false);
    }
  };

  const dropDownItem = open ? (
    <div
      className={`dropdown-menu`}
      style={{ top: `${position.y}px`, left: `${position.x}px`, position: 'absolute', zIndex: 1000 }}
      ref={menuRef}
    >
      {items.map((section, sectionIndex) => (
        <div key={sectionIndex} className="dropdown-section">
          {section.heading && (
            <>
              <div className="dropdown-heading">{section.heading}</div>
            </>
          )}
          {section.items.map((item, idx) =>
            item.type === 'divider' ? (
              <div key={idx} className="dropdown-divider" />
            ) : (
              <div
                key={idx}
                title={item.label}
                className={`dropdown-item ${item.disabled ? 'disabled' : ''} ${item.theme || ''}`}
                onClick={() => handleItemClick(item)}
              >
                {item.icon && <span className="icon">{item.icon}</span>}
                <span className="label">{item.label}</span>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  ) : null

  //  const items = [
  //         {
  //             heading: 'General',
  //             items: [
  //                 { label: 'View', icon: <FaEye />, onClick: () => alert('View Clicked') },
  //                 { label: 'Edit', icon: <FaEdit />, onClick: () => alert('Edit Clicked') },
  //             ],
  //         },
  //         {
  //             heading: 'Actions',
  //             items: [
  //                 { label: 'Add', icon: <FaPlus />, theme: 'primary', onClick: () => alert('Add Clicked') },
  //                 { label: 'Delete', icon: <FaTrash />, theme: 'danger', onClick: () => alert('Delete Clicked') },
  //                 { label: 'Disabled Item', disabled: true },
  //             ],
  //         }
  //     ];



  return (
    <div className="dropdown-wrapper" ref={wrapperRef}>

      <SingleButton name={dropButton?.label} onClick={toggleDropdown} classNames={dropButton?.className}
        style={dropButton?.style} stIcon={dropButton?.stIcon} />

      {open && createPortal(dropDownItem, document.body)}
    </div>
  );
};

export default DropDown