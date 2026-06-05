// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   inactiveFiltersSchema,
//   type InactiveFiltersSchema,
// } from "@/lib/schemas/admin.schema";

// type FiltersModalProps = {
//   open: boolean;
//   onOpenChange: (v: boolean) => void;
//   filterRole?: string;
//   setFilterRole?: (v: string) => void;
//   sortDate: "newest" | "oldest";
//   setSortDate: (v: "newest" | "oldest") => void;
// };

// export function DeactivatedPatientsFiltersModal({
//   open,
//   onOpenChange,
//   filterRole = "all",
//   setFilterRole,
//   sortDate,
//   setSortDate,
// }: FiltersModalProps) {
//   const { register, reset, watch } = useForm<InactiveFiltersSchema>({
//     resolver: zodResolver(inactiveFiltersSchema),
//     defaultValues: {
//       sortDate: "newest",
//       filterRole: "all",
//     },
//   });

//   useEffect(() => {
//     if (open) {
//       reset({
//         sortDate,
//         filterRole,
//       });
//     }
//   }, [open, reset, sortDate, filterRole]);

//   useEffect(() => {
//     const { unsubscribe } = watch((values) => {
//       setFilterRole?.(values.filterRole ?? "all");
//       setSortDate((values.sortDate as "newest" | "oldest") ?? "newest");
//     });

//     return unsubscribe;
//   }, [watch, setFilterRole, setSortDate]);

//   const hasActive =
//     (setFilterRole ? filterRole !== "all" : false) || sortDate !== "newest";

//   const handleReset = () => {
//     reset({ sortDate: "newest", filterRole: "all" });
//     setFilterRole?.("all");
//     setSortDate("newest");
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-sm">
//         <DialogHeader>
//           <DialogTitle className="text-base font-bold text-gray-900">
//             Filters
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4 py-2">
//           {/* SORT */}
//           <div className="space-y-1.5">
//             <p className="text-xs text-gray-400">Sort by date</p>
//             <select
//               {...register("sortDate")}
//               className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1A2B]/20 focus:border-[#8B1A2B]"
//             >
//               <option value="newest">Newest</option>
//               <option value="oldest">Oldest</option>
//             </select>
//           </div>

//           {/* ROLE — only shown when role filtering is supported */}
//           {setFilterRole && (
//             <div className="space-y-1.5">
//               <p className="text-xs text-gray-400">Role</p>
//               <select
//                 {...register("filterRole")}
//                 className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1A2B]/20 focus:border-[#8B1A2B]"
//               >
//                 <option value="all">All Roles</option>
//               </select>
//             </div>
//           )}
//         </div>

//         <DialogFooter className="gap-2">
//           {hasActive && (
//             <Button
//               type="button"
//               variant="ghost"
//               className="text-sm text-gray-400 hover:text-gray-700 mr-auto"
//               onClick={handleReset}
//             >
//               Reset
//             </Button>
//           )}

//           <Button
//             onClick={() => onOpenChange(false)}
//             className="bg-[#8B1A2B] hover:bg-[#7a1726] text-white"
//           >
//             Apply
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
