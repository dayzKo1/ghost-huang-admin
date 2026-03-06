import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { Chronicle } from './types'
import { getChronicles, saveChronicles } from './api'

const { Title } = Typography

const ChroniclesPage = () => {
  const [loading, setLoading] = useState(false)
  const [chronicles, setChronicles] = useState<Chronicle[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingChronicle, setEditingChronicle] = useState<Chronicle | null>(null)
  const [form] = Form.useForm()

  const loadChronicles = async () => {
    setLoading(true)
    try {
      const response = await getChronicles()
      setChronicles(response.data || [])
    } catch (error) {
      console.error(error)
      message.error('Failed to load chronicles. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChronicles()
  }, [])

  const handleEdit = (record: Chronicle) => {
    setEditingChronicle(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAdd = () => {
    setEditingChronicle(null)
    form.resetFields()
    form.setFieldsValue({
      content: []
    })
    setModalVisible(true)
  }

  const handleDelete = async (record: Chronicle) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${record.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedChronicles = chronicles.filter(c => c.year !== record.year)
          await saveChronicles(updatedChronicles)
          setChronicles(updatedChronicles)
          message.success('Chronicle deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete chronicle')
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingChronicle) {
        const updatedChronicles = chronicles.map(c => c.year === editingChronicle.year ? { ...c, ...values } : c)
        await saveChronicles(updatedChronicles)
        setChronicles(updatedChronicles)
        message.success('Chronicle updated successfully')
      } else {
        const newChronicle: Chronicle = {
          ...values,
          content: values.content || [],
        }
        const updatedChronicles = [...chronicles, newChronicle]
        await saveChronicles(updatedChronicles)
        setChronicles(updatedChronicles)
        message.success('Chronicle created successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save chronicle')
    }
  }

  const columns: ColumnsType<Chronicle> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: 120,
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={3}>Chronicles Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Chronicle
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={chronicles}
          rowKey="year"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      <Modal
        title={editingChronicle ? 'Edit Chronicle' : 'Add Chronicle'}
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
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input title' }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: 'Please input year' }]}
          >
            <Input placeholder="Year" />
          </Form.Item>
          <Form.List name="content">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'type']}
                      label="Type"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Type" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      label="Title"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'titleAlign']}
                      label="Title Align"
                    >
                      <Input placeholder="Title Align" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'titleMargin']}
                      label="Title Margin"
                    >
                      <Input placeholder="Title Margin" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'backgroundImage']}
                      label="Background Image"
                    >
                      <Input placeholder="Background Image" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'index']}
                      label="Index"
                    >
                      <Input type="number" placeholder="Index" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'eventImage']}
                      label="Event Image"
                    >
                      <Input placeholder="Event Image" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'songImage']}
                      label="Song Image"
                    >
                      <Input placeholder="Song Image" />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(name)}>
                      <MinusCircleOutlined /> Remove Section
                    </Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Section
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  )
}

export default ChroniclesPage
