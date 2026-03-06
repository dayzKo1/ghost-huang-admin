import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { SocialAccounts } from './types'
import { getSocialAccounts, saveSocialAccounts } from './api'

const { Title } = Typography

const SocialAccountsPage = () => {
  const [loading, setLoading] = useState(false)
  const [socialAccounts, setSocialAccounts] = useState<SocialAccounts[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingSocialAccounts, setEditingSocialAccounts] = useState<SocialAccounts | null>(null)
  const [form] = Form.useForm()

  const loadSocialAccounts = async () => {
    setLoading(true)
    try {
      const response = await getSocialAccounts()
      setSocialAccounts(response.data ? [response.data] : [])
    } catch (error) {
      console.error(error)
      message.error('Failed to load social accounts. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSocialAccounts()
  }, [])

  const handleEdit = (record: SocialAccounts) => {
    setEditingSocialAccounts(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAdd = () => {
    setEditingSocialAccounts(null)
    form.resetFields()
    form.setFieldsValue({
      artist: {
        name: '',
        accounts: []
      }
    })
    setModalVisible(true)
  }

  const handleDelete = async () => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete social accounts?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          setSocialAccounts([])
          await saveSocialAccounts({ artist: { name: '', accounts: [] } })
          message.success('Social accounts deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete social accounts')
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await saveSocialAccounts(values)
      setSocialAccounts([values])
      message.success('Social accounts saved successfully')
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save social accounts')
    }
  }

  const columns: ColumnsType<SocialAccounts> = [
    {
      title: 'Artist Name',
      dataIndex: ['artist', 'name'],
      key: 'artistName',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={3}>Social Accounts Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Social Accounts
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={socialAccounts}
          rowKey={(record) => record.artist?.name || ''}
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={editingSocialAccounts ? 'Edit Social Accounts' : 'Add Social Accounts'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={800}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name={['artist', 'name']}
            label="Artist Name"
            rules={[{ required: true, message: 'Please input artist name' }]}
          >
            <Input placeholder="Artist Name" />
          </Form.Item>
          <Form.List name={['artist', 'accounts']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'platform']}
                      label="Platform"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Platform" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'platformName']}
                      label="Platform Name"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Platform Name" />
                    </Form.Item>
                    <Form.List name={[name, 'accountsList']}>
                      {(itemFields, { add: addItem, remove: removeItem }) => (
                        <>
                          {itemFields.map(({ key: itemKey, name: itemName, ...restItemField }) => (
                            <div key={itemKey} style={{ marginBottom: 8, padding: 8, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'name']}
                                label="Name"
                              >
                                <Input placeholder="Name" />
                              </Form.Item>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'title']}
                                label="Title"
                              >
                                <Input placeholder="Title" />
                              </Form.Item>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'avatar']}
                                label="Avatar"
                              >
                                <Input placeholder="Avatar" />
                              </Form.Item>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'link']}
                                label="Link"
                              >
                                <Input placeholder="Link" />
                              </Form.Item>
                              <Button type="link" danger onClick={() => removeItem(itemName)}>
                                Remove Account
                              </Button>
                            </div>
                          ))}
                          <Button type="dashed" onClick={() => addItem()} block icon={<PlusOutlined />}>
                            Add Account
                          </Button>
                        </>
                      )}
                    </Form.List>
                    <Button type="link" danger onClick={() => remove(name)}>
                      Remove Platform
                    </Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Platform
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  )
}

export default SocialAccountsPage
