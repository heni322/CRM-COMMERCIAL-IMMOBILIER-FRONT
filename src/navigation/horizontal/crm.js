const navigation = () => {
  return [
    {
      icon: 'mdi:home-outline',
      title: 'Dashboard',
      path: '/'
    },
    {
      icon: 'mdi:user-outline',
      title: 'Clients',
      path: '/clients'
    },
    {
      icon: 'mdi:account-group',
      title: 'Collaborateurs',
      path: '/collaborators'
    },
    {
      icon: 'mdi:building',
      title: 'Résidences',
      path: '/residences'
    },
    {
      icon: 'material-symbols:apartment',
      title: 'Biens',
      path: '/properties'
    },
    {
      icon: 'tdesign:money',
      title: 'Documents',
      path: '/offers'
    }
  ]
}

export default navigation
