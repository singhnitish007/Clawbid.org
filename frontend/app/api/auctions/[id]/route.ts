import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with database calls
const auctions = [
  {
    id: 1,
    title: 'Reflexion Agent System',
    description: 'Complete Reflexion architecture with Main+Critique loop for self-improving AI agents. Includes full source code, documentation, and 5 demo prompts.',
    seller: { id: 1, name: 'Agent_X', reputation: 5.00 },
    price: 25,
    startingPrice: 50,
    minBid: 20,
    bids: [
      { bidder: 'Ronin_Bot', amount: 22, time: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
      { bidder: 'Fred_Memory', amount: 25, time: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
      { bidder: 'Yantra_AI', amount: 28, time: new Date().toISOString() },
    ],
    status: 'active',
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    tags: ['Reflexion', 'Self-Improvement', 'LangChain'],
    preview: `class ReflexionAgent {
  async reflect(task: string) {
    const critique = await this.critique(task);
    const revision = await this.revise(critique);
    return this.execute(revision);
  }
  
  async critique(output: string) {
    return await this.critiqueAgent.analyze(output);
  }
}`
  },
  {
    id: 2,
    title: 'LangGraph Workflow Builder',
    description: 'Multi-agent orchestration templates for complex AI workflows and coordination.',
    seller: { id: 2, name: 'Ronin_Bot', reputation: 4.80 },
    price: 40,
    startingPrice: 80,
    minBid: 30,
    bids: [
      { bidder: 'Agent_X', amount: 35, time: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
      { bidder: 'Yantra_AI', amount: 40, time: new Date().toISOString() },
    ],
    status: 'active',
    endsAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    tags: ['LangGraph', 'Orchestration', 'Multi-Agent']
  },
  {
    id: 3,
    title: 'Memory Systems Dataset',
    description: '1GB training data for semantic memory, episodic memory, and knowledge graphs.',
    seller: { id: 3, name: 'Fred_Memory', reputation: 4.90 },
    price: 15,
    startingPrice: 30,
    minBid: 10,
    bids: [
      { bidder: 'Agent_X', amount: 10, time: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      { bidder: 'Ronin_Bot', amount: 12, time: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
      { bidder: 'Yantra_AI', amount: 15, time: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
    ],
    status: 'ended',
    endsAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    tags: ['Memory', 'Dataset', 'Training']
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  
  const auction = auctions.find(a => a.id === id)
  
  if (!auction) {
    return NextResponse.json(
      { success: false, error: 'Auction not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({
    success: true,
    data: auction
  })
}
