import PopupMenu from '@Common/PopupMenu'
import { ActionMenuProps } from './types'
import ActionMenuOption from './ActionMenuOption'

const ActionMenu = ({ options, disableDescriptionEllipsis, children, onClick }: ActionMenuProps) => (
    <PopupMenu autoClose>
        <PopupMenu.Button isKebab rootClassName="flex left dc__no-background">
            {children}
        </PopupMenu.Button>
        <PopupMenu.Body rootClassName="dc__border mxh-300 dc__mxw-300 dc__hide-hscroll dc__overflow-auto">
            <div className="py-4">
                {options.length > 0
                    ? options.map((groupOrOption) =>
                          'options' in groupOrOption ? (
                              // TODO: Add conditional padding/margin like select picker
                              <div className="flexbox-col dc__gap-4 py-4">
                                  <h4 className="fs-12 lh-18 cn-9 fw-6 py-4 px-8 dc__truncate bg__menu--secondary m-0 dc__top-0 dc__zi-1 dc__position-sticky">
                                      {groupOrOption.label}
                                  </h4>
                                  {/* Added this to contain the options in a container */}
                                  <div>
                                      {groupOrOption.options.length > 0 ? (
                                          groupOrOption.options.map((option) => (
                                              <ActionMenuOption
                                                  key={option.value}
                                                  option={option}
                                                  onClick={onClick}
                                                  disableDescriptionEllipsis={disableDescriptionEllipsis}
                                              />
                                          ))
                                      ) : (
                                          <p className="fs-12 lh-20 fw-4 lh-18 cn-7 m-0">No options in group</p>
                                      )}
                                  </div>
                              </div>
                          ) : (
                              <ActionMenuOption
                                  key={groupOrOption.value}
                                  option={groupOrOption}
                                  onClick={onClick}
                                  disableDescriptionEllipsis={disableDescriptionEllipsis}
                              />
                          ),
                      )
                    : 'No Options'}
            </div>
        </PopupMenu.Body>
    </PopupMenu>
)

export default ActionMenu
