import type { CollectionConfig } from 'payload/types'

import { admins } from '../access/admins'
import { anyone } from '../access/anyone'
import adminsAndUser from './access/adminsAndUser'
import { checkRole } from './checkRole'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { loginAfterCreate } from './hooks/loginAfterCreate'

const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    afterChange: [loginAfterCreate],
  },
  auth: true,
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
    },
    {
      name: 'assistantId',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'username',
      type: 'text',
      required: true,
    },
    {
      name: 'phone_number',
      type: 'text',
      required: true,
    },
    {
      name: 'profile_picture',
      type: 'text',
    },
    {
      name: 'uses_social_login',
      type: 'checkbox',
      defaultValue: false,
      required: true,
    },
    {
      name: 'occupation',
      type: 'text',
    },
    {
      name: 'education',
      type: 'select',
      options: [
        {
          label: 'Belum Memilih',
          value: '',
        },
        {
          label: 'Tidak/Belum Sekolah',
          value: 'tidak-belum-sekolah',
        },
        {
          label: 'Tidak Tamat SD/Sederajat',
          value: 'tidak-tamat-sd-sederajat',
        },
        {
          label: 'Tamat SD/Sederajat',
          value: 'tamat-sd-sederajat',
        },
        {
          label: 'SMP/Sederajat',
          value: 'smp-sederajat',
        },
        {
          label: 'SMA',
          value: 'sma',
        },
        {
          label: 'SMK',
          value: 'smk',
        },
        {
          label: 'Diploma I-III',
          value: 'diploma_1_3',
        },
        {
          label: 'Diploma IV/Strata I',
          value: 'diploma_4_s1',
        },
        {
          label: 'Strata II',
          value: 'strata_2',
        },
        {
          label: 'Strata III',
          value: 'strata_3',
        },
      ],
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        {
          label: 'Belum Memilih',
          value: '',
        },
        {
          label: 'Laki-laki',
          value: 'laki-laki',
        },
        {
          label: 'Perempuan',
          value: 'perempuan',
        },
        {
          label: 'Memilih untuk tidak menyebutkan',
          value: 'memilih_untuk_tidak_menyebutkan',
        },
      ],
    },
    {
      name: 'birthdate',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'yyyy-MM-dd',
        }
      }
    },
    {
      name: 'birthplace',
      type: 'text',
    },
    {
      name: 'bio',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'user',
          value: 'user',
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
  ],
  timestamps: true,
}

export default Users
