import React from 'react';

export const OutputAreaByRef = React.forwardRef<
  HTMLDivElement,
  { busy: boolean; content?: string }
>(({ busy, content }, ref) => {
  return (
    <div>
      <div className="border border-white rounded hover:delay-150 hover:border-jupyter max-w-[600px]">
        <div ref={ref}>{content ? content : '[Output Area]'}</div>
        {busy && <div>Cell is running...</div>}
      </div>
    </div>
  );
});
