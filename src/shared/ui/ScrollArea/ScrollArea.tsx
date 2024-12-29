"use client";

import React, { useRef, useEffect, useState } from "react";

interface ScrollAreaProps {
  className?: string;
  children: React.ReactNode;
}

const ScrollArea: React.FC<ScrollAreaProps> = ({ className = "", children }) => {
  return <div className={`relative overflow-x-hidden overflow-y-auto ${className}`}>{children}</div>;
};

export default ScrollArea;
