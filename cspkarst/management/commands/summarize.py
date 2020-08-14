from django.core import management
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q
from datetime import datetime
from cspkarst.models import Sink
import os
import csv

class Command(BaseCommand):
    help = 'summarizes the sink categories'

    def add_arguments(self, parser):
        parser.add_argument('out_location',help='specify the output location for the summary')
        parser.add_argument('-f', '--use_filters', action="store_true",
            help='specify the output location for the summary')

    def handle(self, *args, **options):
        self.summarize(options['out_location'], use_filters=options['use_filters'])


    def summarize(self,out_location,use_filters=False):

        if not os.path.isdir(out_location):
            print(f"{out_location} is not a directory -- operation cancelled")
            return

        print("creating summary of sinks")
        print(f"  --using ROW and NFHL filters: {use_filters}")

        date_time = datetime.today().strftime("%m-%d-%y-%H%M")
        outfile_name = "summary_{}{}.txt".format(date_time,"_filtered" if use_filters else "")
        outfile = os.path.join(out_location,outfile_name)

        print(f"  --output: {os.path.abspath(outfile)}")

        with open(outfile, "w") as out:
            out.write("Summary of Karst Sink\n")
            out.write("  --summary date: {}\n".format(datetime.today().strftime("%m-%d-%y")))
            out.write("  --using Right of Way 30ft filter and National Flood Hazard Layer filters: {}\n".format(str(use_filters)))

        depth_cats = dict(Sink._meta.get_field('depth_cat').choices)
        ordered_dep = list(depth_cats.keys())
        ordered_dep.sort()
        sink_types = dict(Sink._meta.get_field('sink_type').choices)
        ordered_st = list(sink_types.keys())
        ordered_st.sort()

        # summary_dict = {}
        with open(outfile,'a') as out:
            for d in ordered_dep:
                if d == "0-1":
                    continue
                out.write(depth_cats[d]+"\n")
                if use_filters:
                    total = Sink.objects.filter(depth_cat=d,in_nfhl="f",in_row="f")
                else:
                    total = Sink.objects.filter(depth_cat=d)
                total_l = len(total)
                undone = total.filter(sink_type="",depth_cat=d)
                undone_l = len(undone)
                out.write("  Classification Progress: {} of {} ({})\n".format(total_l-undone_l,total_l,undone_l))
                for s in ordered_st:

                    if s == "SINKHOLE":
                        title = "Sinkhole - Probable"
                        probable = len(total.filter(sink_type=s,confidence="PROBABLE"))
                        filler_len = 50-(len(title)+len(str(probable)))
                        out.write("  {}{}{}\n".format(title,"."*filler_len,probable))

                        title = "Sinkhole - Possible"
                        possible = len(total.filter(sink_type=s,confidence="POSSIBLE"))
                        filler_len = 50-(len(title)+len(str(possible)))
                        out.write("  {}{}{}\n".format(title,"."*filler_len,possible))

                    else:
                        ct = len(total.filter(sink_type=s))
                        filler_len = 50-(len(sink_types[s])+len(str(ct)))
                        out.write("  {}{}{}\n".format(sink_types[s],"."*filler_len,ct))
        return
