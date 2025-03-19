import React from 'react';

interface CardWrapperProps {
  url? : string, // ✅ Making url optional
  children: React.ReactNode;
}

export const CardWrapper = ({ url, children }: CardWrapperProps) => {
  return (
    <div
      className="m-10 w-[400px] shadow-xl p-5 rounded-lg flex flex-col gap-[4px]"
      onClick={() => {
        if (url) {
          window.location.href = url;
        }
      }}
    >
      {children}
    </div>
  );
};
