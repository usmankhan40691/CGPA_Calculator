"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Edit, Plus, BookOpen, Calculator, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Course {
  id: number
  name: string
  credit_hours: number
  grade: string
  created_at?: string
}

const GRADE_POINTS = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
}

const GRADES = Object.keys(GRADE_POINTS)

export default function CGPACalculator() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    credit_hours: "",
    grade: "",
  })
  const { toast } = useToast()

  // Mock API functions (replace with actual Django API calls)
  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockCourses: Course[] = [
        { id: 1, name: "Data Structures", credit_hours: 3, grade: "A", created_at: "2024-01-15" },
        { id: 2, name: "Database Systems", credit_hours: 4, grade: "A-", created_at: "2024-01-16" },
        { id: 3, name: "Web Development", credit_hours: 3, grade: "B+", created_at: "2024-01-17" },
        { id: 4, name: "Machine Learning", credit_hours: 4, grade: "B", created_at: "2024-01-18" },
      ]
      setCourses(mockCourses)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveCourse = async (courseData: Omit<Course, "id">) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (editingCourse) {
        // Update existing course
        setCourses((prev) =>
          prev.map((course) => (course.id === editingCourse.id ? { ...course, ...courseData } : course)),
        )
        toast({
          title: "Success",
          description: "Course updated successfully",
        })
      } else {
        // Add new course
        const newCourse: Course = {
          id: Date.now(),
          ...courseData,
        }
        setCourses((prev) => [newCourse, ...prev])
        toast({
          title: "Success",
          description: "Course added successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      })
    }
  }

  const deleteCourse = async (id: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setCourses((prev) => prev.filter((course) => course.id !== id))
      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      })
    }
  }

  const clearAllCourses = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setCourses([])
      toast({
        title: "Success",
        description: "All courses cleared successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear courses",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const calculateCGPA = () => {
    if (courses.length === 0) return 0

    const totalGradePoints = courses.reduce((sum, course) => {
      return sum + GRADE_POINTS[course.grade as keyof typeof GRADE_POINTS] * course.credit_hours
    }, 0)

    const totalCreditHours = courses.reduce((sum, course) => sum + course.credit_hours, 0)

    return totalCreditHours > 0 ? totalGradePoints / totalCreditHours : 0
  }

  const getTotalCreditHours = () => {
    return courses.reduce((sum, course) => sum + course.credit_hours, 0)
  }

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.credit_hours || !formData.grade) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const creditHours = Number.parseInt(formData.credit_hours)
    if (creditHours < 1 || creditHours > 6) {
      toast({
        title: "Validation Error",
        description: "Credit hours must be between 1 and 6",
        variant: "destructive",
      })
      return
    }

    saveCourse({
      name: formData.name.trim(),
      credit_hours: creditHours,
      grade: formData.grade,
    })

    // Reset form
    setFormData({ name: "", credit_hours: "", grade: "" })
    setEditingCourse(null)
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      name: course.name,
      credit_hours: course.credit_hours.toString(),
      grade: course.grade,
    })
  }

  const handleCancelEdit = () => {
    setEditingCourse(null)
    setFormData({ name: "", credit_hours: "", grade: "" })
  }

  const cgpa = calculateCGPA()
  const totalCredits = getTotalCreditHours()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">CGPA Calculator</h1>
          </div>
          <p className="text-gray-600">Track your academic performance and calculate your cumulative GPA</p>
        </div>

        {/* CGPA Display Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Current CGPA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cgpa.toFixed(2)}</div>
              <p className="text-blue-100 text-sm">Out of 4.00</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Total Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCredits}</div>
              <p className="text-green-100 text-sm">Credit Hours</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{courses.length}</div>
              <p className="text-purple-100 text-sm">Completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingCourse ? "Edit Course" : "Add New Course"}
              </CardTitle>
              <CardDescription>
                {editingCourse ? "Update course information" : "Enter course details to add to your record"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  placeholder="e.g., Data Structures"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditHours">Credit Hours</Label>
                <Input
                  id="creditHours"
                  type="number"
                  min="1"
                  max="6"
                  placeholder="1-6"
                  value={formData.credit_hours}
                  onChange={(e) => setFormData((prev) => ({ ...prev, credit_hours: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, grade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade} ({GRADE_POINTS[grade as keyof typeof GRADE_POINTS].toFixed(1)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingCourse ? "Update Course" : "Add Course"}
                </Button>
                {editingCourse && (
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Grade Scale Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Scale Reference</CardTitle>
              <CardDescription>4.0 GPA Scale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(GRADE_POINTS).map(([grade, points]) => (
                  <div key={grade} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{grade}</span>
                    <span className="text-gray-600">{points.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Course List</CardTitle>
              <CardDescription>
                {courses.length === 0
                  ? "No courses added yet"
                  : `${courses.length} course${courses.length !== 1 ? "s" : ""} registered`}
              </CardDescription>
            </div>
            {courses.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Courses</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all courses. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAllCourses}>Clear All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No courses added yet. Add your first course above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{course.name}</h3>
                        <Badge variant="secondary">{course.grade}</Badge>
                        <span className="text-sm text-gray-500">
                          {course.credit_hours} credit{course.credit_hours !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Grade Points:{" "}
                        {(GRADE_POINTS[course.grade as keyof typeof GRADE_POINTS] * course.credit_hours).toFixed(1)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Course</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{course.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCourse(course.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
