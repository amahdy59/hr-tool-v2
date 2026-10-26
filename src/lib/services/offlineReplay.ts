import { z } from 'zod';
import { LeaveService, MissionService } from './dbServices';
import type { QueuedOfflineRequest } from '../offlineQueue';

const decisionSchema = z.object({ leaveId: z.string().min(1) });
const requestSchema = z.object({
  employeeId: z.string().min(1),
  name: z.union([z.string().min(1), z.object({ nameEn: z.string(), nameAr: z.string() })]),
  type: z.string().min(1),
  range: z.string().regex(/^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/),
  duration: z.string().min(1),
  notes: z.string(),
}).passthrough();

export async function replayOfflineAction(item: QueuedOfflineRequest): Promise<boolean> {
  switch (item.type) {
    case 'APPROVE_LEAVE':
    case 'REJECT_LEAVE': {
      const { leaveId } = decisionSchema.parse(item.payload);
      await LeaveService.updateStatus(leaveId, item.type === 'APPROVE_LEAVE' ? 'approved' : 'rejected');
      return true;
    }
    case 'CREATE_LEAVE':
    case 'CREATE_MISSION': {
      const payload = requestSchema.parse(item.payload);
      if (!item.submissionId) return false;
      const service = item.type === 'CREATE_LEAVE' ? LeaveService : MissionService;
      const saved = await service.create({ ...payload, name: payload.name! }, item.submissionId);
      return saved.id === item.submissionId;
    }
    default:
      return false;
  }
}
