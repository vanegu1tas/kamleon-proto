import Sidebar from '../../design-system/components/Sidebar/Sidebar';
import { IconSbDrop } from '../../design-system/icons';
import MyDataScreen from './screens/MyDataScreen';
import { CURRENT_USER } from './mockData';
import styles from './MyData.module.css';

const NAV_SECTIONS = [
  {
    id: 'personal',
    label: '',
    items: [
      { id: 'mydata', label: 'My data', icon: <IconSbDrop />, active: true },
    ],
  },
];

export default function MyData() {
  return (
    <div className={styles.page}>
      <div className={styles.sidebarWrap}>
        <Sidebar sections={NAV_SECTIONS} />
      </div>
      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.avatar}>{CURRENT_USER.initials}</div>
        </div>
        <MyDataScreen />
      </div>
    </div>
  );
}
