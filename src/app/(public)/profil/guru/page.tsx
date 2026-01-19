
import { getTeachers } from '@/actions/teacher';
import TeacherList from './TeacherList';

export const dynamic = 'force-dynamic';

export default async function GuruStafPage() {
    const teachers = await getTeachers();

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Direktori Guru & Staf</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Berkenalan dengan tenaga pendidik dan kependidikan yang berdedikasi di MTsN 1 Pacitan.
                    </p>
                </div>

                <TeacherList initialTeachers={teachers} />

            </div>
        </div>
    );
}
