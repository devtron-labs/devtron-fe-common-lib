import ReactSelect from 'react-select'
import { Option } from '../../../Common'
import { DropdownIndicator } from '../../../Common/RJSF/widgets/Select'

const UserNameDropDownList = ({ clusterDetail, selectedUserNameOptions, onChangeUserName }: any) => {
    const handleUserChange = (selectedOption) => {
        onChangeUserName(selectedOption, clusterDetail)
    }

    if (clusterDetail.userInfos.length === 1) {
        return <span className="dc__ellipsis-right">{clusterDetail.userInfos[0].userName}</span>
    }
    const userNameOptions = clusterDetail.userInfos.map((user) => ({
        label: user.userName,
        value: user.userName,
        errorInConnecting: user.errorInConnecting,
        config: user.config,
    }))

    return (
        <ReactSelect
            classNamePrefix="user_name_dropdown_list"
            options={userNameOptions}
            value={selectedUserNameOptions[clusterDetail.cluster_name]}
            isSearchable={false}
            menuPosition="fixed"
            onChange={handleUserChange}
            menuPlacement="auto"
            components={{
                IndicatorSeparator: null,
                DropdownIndicator,
                Option,
            }}
            styles={{
                control: (base) => ({
                    ...base,
                    backgroundColor: 'white',
                    border: 'none',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    minHeight: 'fit-content',
                    width: 'fit-content',
                    maxWidth: '240px',
                }),
                option: (base, state) => ({
                    ...base,
                    color: 'var(--N900)',
                    backgroundColor: state.isFocused ? 'var(--N100)' : 'white',
                }),
                menu: (base) => ({
                    ...base,
                    marginTop: '2px',
                    minWidth: '240px',
                }),
                singleValue: (base) => ({
                    ...base,
                    verflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }),
                menuList: (base) => ({
                    ...base,
                    position: 'relative',
                    paddingTop: '4px',
                    paddingBotton: '4px',
                    maxHeight: '250px',
                }),
                noOptionsMessage: (base) => ({
                    ...base,
                    color: 'var(--N600)',
                }),
                dropdownIndicator: (base, state) => ({
                    ...base,
                    color: 'var(--N400)',
                    padding: '0 8px',
                    transition: 'all .2s ease',
                    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }),
                valueContainer: (base) => ({
                    ...base,
                    padding: 0,
                }),
            }}
        />
    )
}

export default UserNameDropDownList
