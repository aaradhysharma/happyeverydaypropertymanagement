import { NextResponse } from 'next/server'

interface CountyData {
  name: string
  population: number
  state: string
}

export async function GET() {
  try {
    // Simulate calling Perplexity API
    // In a real implementation, you would call the actual Perplexity API here
    
    // For now, return mock data that represents top counties by population
    const mockData: CountyData[] = [
      { name: 'Los Angeles County', population: 10014009, state: 'California' },
      { name: 'Cook County', population: 5275541, state: 'Illinois' },
      { name: 'Harris County', population: 4731145, state: 'Texas' },
      { name: 'Maricopa County', population: 4428235, state: 'Arizona' },
      { name: 'San Diego County', population: 3298634, state: 'California' },
      { name: 'Orange County', population: 3175692, state: 'California' },
      { name: 'Miami-Dade County', population: 2701747, state: 'Florida' },
      { name: 'Kings County', population: 2590516, state: 'New York' },
      { name: 'Dallas County', population: 2613175, state: 'Texas' },
      { name: 'Wayne County', population: 1797610, state: 'Michigan' }
    ]

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      data: mockData,
      message: 'Top counties by population retrieved successfully'
    })

  } catch (error) {
    console.error('Error fetching county data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch county data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}


