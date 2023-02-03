import React from 'react';

export const OutputAreaByRef = React.forwardRef<
  HTMLDivElement,
  { busy: boolean; content?: string }
>(({ busy, content }, ref) => {
  return (
    <div>
      <div className="m-1 hover:delay-15">
        <div className="p-1 rounded" ref={ref}>
          {content ? content : '[Output Area]'}
        </div>
        {busy && <div>Cell is running...</div>}
      </div>
    </div>
  );
});
