import Multi_Select from 'react-native-multiple-select';

export default function MultiSelect(props) {
    const { items, selectedItems, onChange, selectText } = props;

    return(
        <Multi_Select
            items={items}
            selectedItems={selectedItems}
            onSelectedItemsChange={onChange}
            hideSubmitButton={true}
            uniqueKey='name'
            selectText={selectText}
            searchInputPlaceholderText='Поиск'
            submitButtonText='Выбрать'
            styleDropdownMenu={{ borderRadius: 20, overflow: 'hidden', height: 45,  }}
            styleDropdownMenuSubsection={{ backgroundColor: '#353941' }}
            styleTextDropdownSelected={{ paddingHorizontal: 20, fontSize: 20, color: 'white' }}
            styleTextDropdown={{ paddingHorizontal: 20, fontSize: 20, color: 'white' }}
            styleItemsContainer={{ backgroundColor: '#353941' }}
            styleInputGroup={{ backgroundColor: '#353941', height: 45, paddingRight: 10, }}
            styleMainWrapper={{ borderRadius: 20, overflow: 'hidden', backgroundColor: '#353941' }}
            styleRowList={{ height: 45 }}
            itemTextColor='#FFF'
        />
    )
}