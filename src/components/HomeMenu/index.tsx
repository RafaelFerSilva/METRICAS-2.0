import { List } from "@chakra-ui/react";
import HomeMenuItem from "../HomeMenuItem"
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
        { itemName: 'Tests Report', itemUrl: "/testsReport", icon: FaVial }
    ]

    return (
        <List >
            {menuItens.map((item: MenuItem) => {
                return (
                    <HomeMenuItem key={item.itemName}  menuItem={item}/>
                )
            })}
        </List>
    )
}
