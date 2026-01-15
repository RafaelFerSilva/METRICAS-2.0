import { NavSection } from "./NavSection";
import { TeamsListsMenu} from './TeamsListsMenu'


interface Team {
  description: string;
  id: string;
  identityUrl: string;
  name: string;
  projectId: string;
  projectName: string;
  url: string;
}

interface SideBarNavProps {
  setTeam: (team: Team) => void;
}

export function SidebarNav({setTeam}: SideBarNavProps) {

  return (
    <NavSection >
      <TeamsListsMenu setTeam={setTeam}/>
    </NavSection>
    
  );
}
