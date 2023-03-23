let ArrayMenu = [
    {
        menuId:'A',
        menuName: '画面'
    },
    {
        menuId:'B',
        menuName: '头发'
    },
    {
        menuId:'C',
        menuName: '眼睛'
    },
    {
        menuId:'D',
        menuName: '身体'
    },
    {
        menuId:'E',
        menuName: '套装'
    },
    {
        menuId:'F',
        menuName: '上装'
    },
    {
        menuId:'G',
        menuName: '下装'
    },
    {
        menuId:'H',
        menuName: '鞋子'
    },
    {
        menuId:'I',
        menuName: '首饰'
    },
]

let ArrayChildMenu = [
    {
        childMenuId:'A01',
        belongMenuId:'A',
        childMenuName:'常用'
    },
    {
        childMenuId:'A02',
        belongMenuId:'A',
        childMenuName:'光照'
    },
    {
        childMenuId:'A03',
        belongMenuId:'A',
        childMenuName:'风格'
    },
    {
        childMenuId:'A04',
        belongMenuId:'A',
        childMenuName:'视角'
    },
    {
        childMenuId:'A05',
        belongMenuId:'A',
        childMenuName:'其他'
    },
]

let ArrayPrompt = [
    {
        promptUUID:'sidahsd',
        belongChildMenuID: 'A01',
        promptName: 'masterpiece',
        promptTranslation: '杰作',
    },
    {
        promptUUID:'gdsgesf',
        belongChildMenuID: 'A01',
        promptName: 'best quality',
        promptTranslation: '最好的质量'
    },
    {
        promptUUID:'jdighusdf',
        belongChildMenuID: 'A01',
        promptName: 'extremely detailed CG unity 8k wallpapery',
        promptTranslation: '极为详细的CG unity 8K壁纸'
    },
]

export {ArrayMenu, ArrayChildMenu, ArrayPrompt};