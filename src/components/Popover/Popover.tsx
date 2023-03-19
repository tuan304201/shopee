import {
  useFloating,
  FloatingPortal,
  FloatingArrow,
  arrow,
  offset,
  useHover,
  useInteractions,
  safePolygon,
  shift,
  type Placement
} from '@floating-ui/react'
import { useRef, useState, useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  renderPopover: React.ReactNode
  placement?: Placement
}

export default function Popover({ children, className, renderPopover, placement }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef(null)
  const { x, y, strategy, refs, context, middlewareData } = useFloating({
    middleware: [
      offset(5),
      shift(),
      arrow({
        element: arrowRef
      })
    ],
    placement: placement,
    open: isOpen,
    onOpenChange: setIsOpen
  })

  const id = useId()
  const hover = useHover(context, {
    handleClose: safePolygon()
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([hover])
  return (
    <div className={className} ref={refs.setReference} {...getReferenceProps()}>
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
              {...getFloatingProps()}
            >
              <FloatingArrow ref={arrowRef} context={context} fill='white' />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  )
}
