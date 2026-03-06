import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons'
import type { Blessing } from './types'
import { getBlessings, saveBlessings } from './api'

const { Title } = Typography

const BlessingsPage = () => {
  const [loading, setLoading] = useState(false)
  const [blessings, setBlessings] = useState<Blessing[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingBlessing, setEditingBlessing] = useState<Blessing | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const loadBlessings = async () => {
    setLoading(true)
    try {
      const response = await getBlessings()
      setBlessings(response.data || [])
    } catch (error) {
      console.error(error)
      message.error('Failed to load blessings. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlessings()
  }, [])

  const handleEdit = (record: Blessing) => {
    setEditingBlessing(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAdd = () => {
    setEditingBlessing(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleDelete = async (record: Blessing) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${record.username}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedBlessings = blessings.filter(b => b.userId !== record.userId)
          await saveBlessings(updatedBlessings)
          setBlessings(updatedBlessings)
          message.success('Blessing deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete blessing')
        }
      },
    })
  }

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one item to delete')
      return
    }
    Modal.confirm({
      title: 'Confirm Batch Delete',
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected blessings?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedBlessings = blessings.filter(b => !selectedRowKeys.includes(b.userId))
          await saveBlessings(updatedBlessings)
          setBlessings(updatedBlessings)
          setSelectedRowKeys([])
          message.success(`${selectedRowKeys.length} blessings deleted successfully`)
        } catch (error) {
          console.error(error)
          message.error('Failed to delete blessings')
        }
      },
    })
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(blessings, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'blessings.json'
    link.click()
    URL.revokeObjectURL(url)
    message.success('Blessings exported successfully')
  }

  const filteredBlessings = blessings.filter(b => 
    b.username.toLowerCase().includes(searchText.toLowerCase()) ||
    b.blessingMessage.toLowerCase().includes(searchText.toLowerCase()) ||
    b.keyword?.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingBlessing) {
        const updatedBlessings = blessings.map(b => b.userId === editingBlessing.userId ? { ...b, ...values } : b)
        await saveBlessings(updatedBlessings)
        setBlessings(updatedBlessings)
        message.success('Blessing updated successfully')
      } else {
        const newBlessing: Blessing = {
          ...values,
          createdAt: new Date().toISOString(),
        }
        const updatedBlessings = [...blessings, newBlessing]
        await saveBlessings(updatedBlessings)
        setBlessings(updatedBlessings)
        message.success('Blessing created successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save blessing')
    }
  }

  const columns: ColumnsType<Blessing> = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 200,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Blessing Message',
      dataIndex: 'blessingMessage',
      key: 'blessingMessage',
      ellipsis: true,
    },
    {
      title: 'Keyword',
      dataIndex: 'keyword',
      key: 'keyword',
    },
    {
      title: 'Original Link',
      dataIndex: 'originalLink',
      key: 'originalLink',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
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
            onClick={() => handleDelete(record)}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={3}>祝福管理</Title>
          <Space>
            <Input
              placeholder="搜索用户名、祝福内容或关键词"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加祝福
            </Button>
            <Button icon={<DeleteOutlined />} onClick={handleBatchDelete} disabled={selectedRowKeys.length === 0}>
              批量删除
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出数据
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filteredBlessings}
          rowKey="userId"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingBlessing ? 'Edit Blessing' : 'Add Blessing'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="userId"
            label="User ID"
            rules={[{ required: true, message: 'Please input user ID' }]}
          >
            <Input placeholder="User ID" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="blessingMessage"
            label="Blessing Message"
            rules={[{ required: true, message: 'Please input blessing message' }]}
          >
            <Input.TextArea rows={4} placeholder="Blessing Message" />
          </Form.Item>
          <Form.Item
            name="keyword"
            label="Keyword"
          >
            <Input placeholder="Keyword" />
          </Form.Item>
          <Form.Item
            name="originalLink"
            label="Original Link"
          >
            <Input placeholder="Original Link" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BlessingsPage
