import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

// Custom Select Root wrapper that prevents scroll locking
const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>
>(({ onOpenChange, ...props }, ref) => {
  // Intercept open/close to prevent scroll locking
  const handleOpenChange = React.useCallback((open: boolean) => {
    // Immediately prevent scroll locking
    const preventLock = () => {
      // Remove data-scroll-locked attributes
      if (document.body.hasAttribute('data-scroll-locked')) {
        document.body.removeAttribute('data-scroll-locked');
      }
      if (document.documentElement.hasAttribute('data-scroll-locked')) {
        document.documentElement.removeAttribute('data-scroll-locked');
      }
      // Force scrollbar to remain visible on body only
      if (document.body.style.overflow === 'hidden' || document.body.style.overflow === '') {
        document.body.style.overflow = 'scroll';
      }
      // Don't set overflow on html - only body should scroll to prevent double scrollbars
      if (document.documentElement.style.overflow === 'hidden' || document.documentElement.style.overflow === '') {
        document.documentElement.style.overflow = 'visible';
      }
    };
    
    // Call original handler
    onOpenChange?.(open);
    
    // Prevent scroll lock immediately and continuously
    preventLock();
    if (open) {
      // While open, continuously check and fix
      const interval = setInterval(preventLock, 10);
      setTimeout(() => clearInterval(interval), 100); // Stop after 100ms of continuous checking
    }
  }, [onOpenChange]);
  
  return <SelectPrimitive.Root {...props} ref={ref} onOpenChange={handleOpenChange} />;
});
Select.displayName = SelectPrimitive.Root.displayName;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  // Prevent body scroll lock and maintain scrollbar visibility when Select is open
  React.useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    // Store original body styles from computed styles (not inline styles)
    const computedStyle = window.getComputedStyle(document.body);
    const originalOverflow = computedStyle.overflow;
    const originalPaddingRight = computedStyle.paddingRight;
    const originalBodyOverflowStyle = document.body.style.overflow || '';
    const originalBodyPaddingRightStyle = document.body.style.paddingRight || '';

    // Function to ensure scrollbar remains visible - prevent body scroll lock
    const ensureScrollbarVisible = () => {
      // Remove data-scroll-locked attributes that Radix might add
      if (document.body.hasAttribute('data-scroll-locked')) {
        document.body.removeAttribute('data-scroll-locked');
      }
      if (document.documentElement.hasAttribute('data-scroll-locked')) {
        document.documentElement.removeAttribute('data-scroll-locked');
      }
      
      // Aggressively prevent overflow:hidden on body only
      if (document.body.style.overflow === 'hidden' || document.body.style.overflow === '') {
        // Restore to original or use 'scroll' to ensure scrollbar is always visible
        document.body.style.overflow = originalBodyOverflowStyle || originalOverflow || 'scroll';
      }
      // Don't set overflow on html - only body should scroll to prevent double scrollbars
      if (document.documentElement.style.overflow === 'hidden' || document.documentElement.style.overflow === '') {
        document.documentElement.style.overflow = 'visible';
      }
      
      // Prevent padding-right changes that might affect layout
      if (document.body.style.paddingRight && document.body.style.paddingRight !== originalBodyPaddingRightStyle) {
        document.body.style.paddingRight = originalBodyPaddingRightStyle;
      }
    };

    // Continuous monitoring with interval (more aggressive)
    let checkInterval: NodeJS.Timeout | null = null;
    
    // Monitor for state changes on the content element
    const observer = new MutationObserver(() => {
      const state = contentElement.getAttribute('data-state');
      if (state === 'open') {
        // Immediately ensure scrollbar is visible
        ensureScrollbarVisible();
        
        // Start continuous checking while open
        if (checkInterval) {
          clearInterval(checkInterval);
        }
        checkInterval = setInterval(() => {
          ensureScrollbarVisible();
        }, 16); // Check every frame (~60fps)
        
        // Also use requestAnimationFrame for immediate checks
        requestAnimationFrame(() => {
          ensureScrollbarVisible();
          setTimeout(ensureScrollbarVisible, 0);
          setTimeout(ensureScrollbarVisible, 10);
          setTimeout(ensureScrollbarVisible, 50);
        });
      } else if (state === 'closed') {
        // Stop checking when closed
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
      }
    });

    // Observe the content element for state changes
    observer.observe(contentElement, {
      attributes: true,
      attributeFilter: ['data-state']
    });

    // Also observe body style changes directly with immediate callback
    const bodyObserver = new MutationObserver(() => {
      ensureScrollbarVisible();
    });

    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
      attributeOldValue: true
    });

    // Check initial state
    const initialState = contentElement.getAttribute('data-state');
    if (initialState === 'open') {
      ensureScrollbarVisible();
      checkInterval = setInterval(() => {
        ensureScrollbarVisible();
      }, 16);
    }

    // Cleanup
    return () => {
      observer.disconnect();
      bodyObserver.disconnect();
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      // Restore original styles only if they were changed
      if (document.body.style.overflow !== originalBodyOverflowStyle) {
        document.body.style.overflow = originalBodyOverflowStyle;
      }
      if (document.body.style.paddingRight !== originalBodyPaddingRightStyle) {
        document.body.style.paddingRight = originalBodyPaddingRightStyle;
      }
    };
  }, []);

  // Combine refs
  const combinedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      contentRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={combinedRef}
        modal={false}
        onOpenAutoFocus={(e) => {
          // Prevent any focus-related scroll locking
          e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          // Prevent any focus-related scroll locking
          e.preventDefault();
        }}
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
