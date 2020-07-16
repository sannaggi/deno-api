import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Product } from '../types.ts'

let products: Product[] = [
    {
        id: '1',
        name: 'one',
        description: 'product 1',
        price: 10
    },
    {
        id: '2',
        name: 'two',
        description: 'product 2',
        price: 30
    },
    {
        id: '3',
        name: 'three',
        description: 'product 3',
        price: 30
    },
]

// @desc    Get all products
// @route   GET /api/v1/products
const getProducts = ({ response }: { response: any }) => {
    response.body = {
        success: true,
        data: products
    }
}

// @desc    Get single product
// @route   GET /api/v1/products/:id
const getProduct = ({ params, response }: { params: { id: string }, response: any }) => {
    const product: Product | undefined = products.find(p => p.id === params.id)

    if (product) {
        response.status = 200
        response.body = {
            success: true,
            data: product
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            msg: 'no product found'
        }
    }
}

// @desc    Add product
// @route   POST /api/v1/products
const addProduct = async ({ request, response }: { request: any, response: any }) => {
    if (!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            msg: 'no data'
        }
        return
    }

    const body = request.body()
    const product: Product = await body.value
    product.id = v4.generate()
    products.push(product)

    response.status = 201
    response.body = {
        success: true,
        data: product
    }
}

// @desc    Update product
// @route   PUT /api/v1/products/:id
const updateProduct = async ({ params, request, response }: { params: {id: string}, request: any, response: any }) => {
    if (!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            msg: 'no data'
        }
        return
    }

    const body = request.body()
    const updateData: { name?: string, description?: string, price?: number } = await body.value

    products = products.map(p => p.id === params.id? { ...p, ...updateData } : p)

    response.status = 201
    response.body = {
        success: true,
        data: products
    }
}

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
const deleteProduct = ({ params, response }: { params: { id: string }, response: any }) => {
    products = products.filter(p => p.id !== params.id)

    response.body = {
        success: true,
        msg: 'product removed'
    }
}

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct }