const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: 'tabler:layout-dashboard',
      path: '/dashboards/analytics'
    },
    {
      title: 'Teachers',
      icon: 'tabler:users',
      path: '/teachers'
    },
    {
      title: 'Students',
      icon: 'tabler:student',
      path: '/students'
    },
    {
      title: 'Classes',
      icon: 'tabler:building-warehouse',
      path: '/classes'
    },
    {
      title: 'Subjects',
      icon: 'tabler:books',
      path: '/subjects'
    },
    {
      title: 'Kurikulum',
      icon: 'tabler:book',
      path: '/admin/curriculum'
    },
    {
      title: 'Absensi',
      icon: 'tabler:calendar-check',
      path: '/attendance'
    },
    {
      title: 'Materials',
      icon: 'tabler:book-open',
      path: '/materials'
    },
    {
      title: 'Tasks',
      icon: 'tabler:clipboard-list',
      path: '/tasks'
    },
    {
      title: 'Penilaian',
      icon: 'tabler:folder-check',
      path: '/admin/assessment/bank'
    },
    {
      title: 'Keuangan',
      icon: 'tabler:cash',
      path: '/billing'
    },
    {
      title: 'Kartu Pelajar',
      icon: 'tabler:credit-card',
      path: '/cards'
    },
    {
      title: 'Perpustakaan',
      icon: 'tabler:book',
      path: '/library'
    }
  ]
}

export default navigation
