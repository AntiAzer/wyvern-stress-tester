import { adminRoot } from "./defaultValues";
// import { UserRole } from "../helpers/authHelper"

const data = [
  {
    id: 'dashboards',
    icon: 'simple-icon-grid',
    label: 'menu.dashboards',
    to: `${adminRoot}/dashboards`,
    // roles: [UserRole.Admin, UserRole.Editor],
    subs: [
      {
        icon: 'simple-icon-cursor',
        label: 'menu.dashboards.bot',
        to: `${adminRoot}/dashboards/bot`,
      },
      {
        icon: 'simple-icon-pie-chart',
        label: 'menu.dashboards.server',
        to: `${adminRoot}/dashboards/server`,
      },
    ],
  },
  {
    id: 'attack',
    icon: 'simple-icon-ghost',
    label: 'menu.attack',
    to: `${adminRoot}/attack`,
    subs: [
      {
        icon: 'simple-icon-layers',
        label: 'menu.attack.simple',
        to: `${adminRoot}/attack/simple`,
      },
      {
        icon: 'simple-icon-equalizer',
        label: 'menu.attack.custom',
        to: `${adminRoot}/attack/custom`,
      },
      {
        icon: 'simple-icon-lock-open',
        label: 'menu.attack.bypass',
        to: `${adminRoot}/attack/bypass`,
      },
    ],
  },
  {
    id: 'bot',
    icon: 'simple-icon-cursor',
    label: 'menu.bot',
    to: `${adminRoot}/bot`,
    subs: [
      {
        icon: 'simple-icon-drawer',
        label: 'menu.bot.task',
        to: `${adminRoot}/bot/task`,
      },
      {
        icon: 'simple-icon-vector',
        label: 'menu.bot.list',
        to: `${adminRoot}/bot/list`,
      },
    ],
  },
  {
    id: 'Setting',
    icon: 'simple-icon-settings',
    label: 'menu.setting',
    to: `${adminRoot}/setting`,
    subs: [
      {
        icon: 'simple-icon-organization',
        label: 'menu.setting.server',
        to: `${adminRoot}/setting/server`,
      },
    ],
  },
  {
    id: 'Docs',
    icon: 'simple-icon-book-open',
    label: 'menu.docs',
    to: `${adminRoot}/docs`,
    subs: [
      {
        icon: 'simple-icon-doc',
        label: 'menu.docs.setting-server',
        to: `${adminRoot}/docs/setting-server`,
      },
      {
        icon: 'simple-icon-doc',
        label: 'menu.docs.attack-method',
        to: `${adminRoot}/docs/attack-method`,
      },
      {
        icon: 'simple-icon-doc',
        label: 'menu.docs.attack-tutorial',
        to: `${adminRoot}/docs/attack-tutorial`,
      },
      {
        icon: 'simple-icon-doc',
        label: 'menu.docs.credit',
        to: `${adminRoot}/docs/credit`,
      },
    ],
  },
];
export default data;
