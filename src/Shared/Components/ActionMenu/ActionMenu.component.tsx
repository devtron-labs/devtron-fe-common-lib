import PopupMenu from '@Common/PopupMenu'
import { ActionMenuProps } from './types'
import ActionMenuOption from './ActionMenuOption'
import './actionMenu.scss'

const ActionMenu = ({ options, disableDescriptionEllipsis, children, onClick }: ActionMenuProps) => (
    <PopupMenu autoClose>
        <PopupMenu.Button isKebab rootClassName="flex left dc__no-background">
            {/* TODO: fix the issue with immediate button child */}
            {children}
        </PopupMenu.Button>
        <PopupMenu.Body rootClassName="dc__border mxh-300 dc__mnw-100 dc__mxw-250 dc__hide-hscroll dc__overflow-auto mt-4 mb-4">
            <div className="py-4">
                {options.length > 0
                    ? options.map((groupOrOption) =>
                          'options' in groupOrOption ? (
                              <div className="flexbox-col dc__gap-4 py-4 action-menu__group" key={groupOrOption.label}>
                                  <h4 className="fs-12 lh-18 cn-9 fw-6 py-4 px-12 dc__truncate bg__menu--secondary m-0 dc__top-0 dc__zi-1 dc__position-sticky">
                                      {groupOrOption.label}
                                  </h4>
                                  {/* Added this to contain the options in a container and have gap only b/w heading & container */}
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
                                          <p className="fs-13 lh-18 fw-4 lh-18 cn-7 py-6 px-12 m-0">
                                              No options in group
                                          </p>
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
