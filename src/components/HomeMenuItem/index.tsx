import { Box, ListIcon, ListItem } from "@chakra-ui/react";

interface MenuItem {
    itemName: string;
    itemUrl: string;
    // icon: any;
}

interface MenuProps {
    menuItem: MenuItem;
    key: number;
}

export default function HomeMenuItem({menuItem, key}: MenuProps) {

    return (
        <Box key={key} p="2" boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
            _hover={{
                bg: 'gray.100',
            }}
            _focus={{
                bg: 'green.700',
            }}>
            <ListItem as="a" href={menuItem.itemUrl}>
                {/* <ListIcon as={menuItem.icon} color='blue.500' /> */}
                {menuItem.itemName}
            </ListItem>
        </Box>
    )
}