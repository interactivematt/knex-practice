require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

function searchByProductName(searchTerm) {
  knexInstance
    .select('name')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

searchByProductName('a')

function paginateProducts(page) {
  const productsPerPage = 6
  const offset = productsPerPage * (page - 1)
  const max = offset + productsPerPage
  knexInstance
    .select('name')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
      console.log(`Viewing results: ${offset} - ${max}`)
    })
}

paginateProducts(2)

function itemsAddedAfterDate(daysAgo) {
  knexInstance
    .select('id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
    )
    .then(results => {
      console.log('PRODUCTS ADDED DAYS AGO')
      console.log(results)
    })
}

itemsAddedAfterDate(30)

function costPerCategory() {
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log('COST PER CATEGORY')
      console.log(result)
    })
}

costPerCategory()