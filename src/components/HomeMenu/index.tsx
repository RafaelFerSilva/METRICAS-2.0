import { Box, List, ListIcon, ListItem } from "@chakra-ui/react";
import { FaHome, FaRocket, FaVial, FaFilter } from "react-icons/fa";


interface MenuItem {
    itemName: string;
    itemUrl: string;
    icon: any;
}

interface PropsHomeMenu {
    setRenderComponent: (component: string) => void;
}

export default function HomeMenu({ setRenderComponent }: PropsHomeMenu) {

    const menuItens: MenuItem[] = [
        // { itemName: 'Home', itemUrl: "/home", icon: FaHome },
        { itemName: 'Sprint Report', itemUrl: "/sprintReport", icon: FaRocket },
        { itemName: 'Comparison of Sprints', itemUrl: "/sprintCompare", icon: FaRocket },
        { itemName: 'Runs Report', itemUrl: "/testsReport", icon: FaVial },
        { itemName: 'Tests Graphics', itemUrl: "/testsGraphics", icon: FaFilter },
        { itemName: 'Tests Cases', itemUrl: "/alltestsCases", icon: FaFilter }
    ]

    const handleMenuItem = (event: any) => {
        setRenderComponent(event.target.innerText)
    }


    return (
        <>
            <List >
                {menuItens.map((item: MenuItem) => {
                    return (
                        <Box
                            key={item.itemName}
                            p="2"
                            boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
                            _hover={{
                                bg: 'gray.100',
                            }}
                            _focus={{
                                bg: 'green.700',
                            }}
                        >
                            <ListItem as="button" fontSize="sm" onClick={handleMenuItem}>
                                <ListIcon as={item.icon} fontSize="18" color='blue.500' />
                                {item.itemName}
                            </ListItem>
                        </Box>
                    )
                })}
            </List>
        </>
    )
}
