import { Box, List, ListIcon, ListItem } from "@chakra-ui/react";
import { FaHome, FaRocket, FaVial } from "react-icons/fa";

interface MenuItem {
    itemName: string;
    itemUrl: string;
    icon: any;
}

export default function HomeMenu() {

    const menuItens: MenuItem[] = [
        { itemName: 'Home', itemUrl: "/home", icon: FaHome },
        { itemName: 'Sprint Report', itemUrl: "/sprintReport", icon: FaRocket },
        { itemName: 'Tests Report', itemUrl: "/testsReport", icon: FaVial },
        { itemName: 'Tests Grafhics', itemUrl: "/testsGraphics", icon: FaVial }
    ]

    return (
        <List >
            {menuItens.map((item: MenuItem) => {
                return (
                    <Box key={item.itemName} p="2" boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
                        _hover={{
                            bg: 'gray.100',
                        }}
                        _focus={{
                            bg: 'green.700',
                        }}>
                        <ListItem as="a" href={item.itemUrl} fontSize=".975rem">
                            <ListIcon as={item.icon} fontSize="30" color='blue.500' />
                            {item.itemName}
                        </ListItem>
                    </Box>
                )
            })}
        </List>
    )
}
