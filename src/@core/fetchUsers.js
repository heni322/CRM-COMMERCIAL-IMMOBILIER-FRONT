import axios from 'axios'

export async function fetchUsers() {
  const response = await axios.get('http://141.94.78.248:8850/')

  return response.data
}
